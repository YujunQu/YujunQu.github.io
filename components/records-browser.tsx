"use client";

import { useMemo, useState } from "react";

export type BrowserRecord = {
  id: string;
  species: string;
  sample: string;
  target: string;
  dye: string;
  clone: string | null;
  productName: string;
  catalogNo: string;
  concentration: string | null;
  vendor: string | null;
  vendorDose: string | null;
  system: string | null;
  stainCondition: string | null;
  optimalDose: string | null;
  minimumDose: string | null;
  titrationResult: string | null;
  imageUrl: string | null;
};

const customSpeciesOrder = ["Human", "Mouse", "pig"];

function isMissing(value: string | null | undefined) {
  if (value === null || value === undefined) {
    return true;
  }
  const normalized = String(value).trim();
  return normalized === "" || normalized === "\\" || normalized === "/" || normalized === "未知";
}

function displayValue(value: string | null | undefined, fallback = "待补充") {
  return isMissing(value) ? fallback : value;
}

export function RecordsBrowser({ records }: { records: BrowserRecord[] }) {
  const [search, setSearch] = useState("");
  const [species, setSpecies] = useState("");
  const [dye, setDye] = useState("");
  const [preview, setPreview] = useState<{ src: string; title: string } | null>(null);

  const searchMatches = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return records;
    }

    return records.filter((item) =>
      [item.target, item.productName, item.catalogNo, item.clone ?? "", item.vendor ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(query),
    );
  }, [records, search]);

  const filteredRecords = useMemo(() => {
    return searchMatches.filter((item) => {
      if (species && item.species !== species) return false;
      if (dye && item.dye !== dye) return false;
      return true;
    });
  }, [searchMatches, species, dye]);

  const visibleSpecies = useMemo(() => {
    return Array.from(
      new Set(
        searchMatches
          .filter((item) => (dye ? item.dye === dye : true))
          .map((item) => item.species),
      ),
    ).sort((left, right) => {
      const leftIndex = customSpeciesOrder.indexOf(left);
      const rightIndex = customSpeciesOrder.indexOf(right);
      const safeLeft = leftIndex === -1 ? Number.MAX_SAFE_INTEGER : leftIndex;
      const safeRight = rightIndex === -1 ? Number.MAX_SAFE_INTEGER : rightIndex;
      return safeLeft - safeRight || left.localeCompare(right, "zh-CN");
    });
  }, [searchMatches, dye]);

  const visibleDyes = useMemo(() => {
    return Array.from(
      new Set(
        searchMatches
          .filter((item) => (species ? item.species === species : true))
          .map((item) => item.dye),
      ),
    ).sort((left, right) => left.localeCompare(right, "en"));
  }, [searchMatches, species]);

  const activeChips = [
    search ? `关键词: ${search}` : null,
    species ? `反应物种: ${species}` : null,
    dye ? `染料: ${dye}` : null,
  ].filter(Boolean) as string[];

  return (
    <>
      <div className="catalog-shell">
        <aside className="filters-panel">
          <div className="panel-header">
            <div>
              <p className="panel-kicker">Filter Directory</p>
              <h2>筛选条件</h2>
            </div>
            <button
              type="button"
              className="secondary-button"
              onClick={() => {
                setSearch("");
                setSpecies("");
                setDye("");
              }}
            >
              Clear All
            </button>
          </div>

          <div className="search-card">
            <label className="field">
              <span>关键词检索</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="输入靶点、产品名、货号、克隆号或厂家"
              />
            </label>
          </div>

          <section className="filter-group">
            <div className="filter-heading">
              <h3>反应物种</h3>
              <span className="filter-count">{visibleSpecies.length} 项</span>
            </div>
            <div className="filter-options">
              {visibleSpecies.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`filter-chip${species === item ? " is-active" : ""}`}
                  onClick={() => setSpecies(species === item ? "" : item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </section>

          <section className="filter-group">
            <div className="filter-heading">
              <h3>染料</h3>
              <span className="filter-count">{visibleDyes.length} 项</span>
            </div>
            <div className="filter-options">
              {visibleDyes.map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`filter-chip${dye === item ? " is-active" : ""}`}
                  onClick={() => setDye(dye === item ? "" : item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </section>
        </aside>

        <section className="results-panel">
          <div className="results-toolbar">
            <div>
              <p className="panel-kicker">Search Results</p>
              <h2>{activeChips.length ? "筛选结果" : "全部记录"}</h2>
            </div>
            <div className="result-badge">
              <strong>{filteredRecords.length}</strong>
              <span>条命中</span>
            </div>
          </div>

          {activeChips.length ? (
            <div className="active-filters">
              {activeChips.map((chip) => (
                <span key={chip} className="active-chip">
                  {chip}
                </span>
              ))}
            </div>
          ) : null}

          <div className="results-list">
            {filteredRecords.length === 0 ? (
              <div className="empty-state">
                <p className="empty-title">没有找到匹配记录</p>
                <p className="empty-text">请调整筛选条件或清空关键词后再试。</p>
              </div>
            ) : null}

            {filteredRecords.map((item) => {
              const previewTitle = `${item.target} · ${item.species} · ${item.dye}`;

              return (
                <article className="result-card" key={item.id}>
                  <div className="result-card-accent" />
                  <div className="result-card-body">
                    <div className="result-card-header">
                      <div className="result-card-main">
                        <div className="result-flags">
                          <span className="flag flag-dye">{item.dye}</span>
                          <span className="flag">{item.species}</span>
                          <span className="flag flag-light">{item.sample}</span>
                        </div>
                        <h3>{item.target}</h3>
                        <p className="product-name">{item.productName}</p>
                      </div>
                      <div className="dose-box">
                        <span className="dose-label">最佳用量</span>
                        <strong>{displayValue(item.optimalDose)}</strong>
                        <span className="dose-sub">最低用量 {displayValue(item.minimumDose)}</span>
                      </div>
                    </div>

                    <div className="result-card-content">
                      <dl className="meta-grid">
                        <div className="meta-item">
                          <dt>货号</dt>
                          <dd>{displayValue(item.catalogNo)}</dd>
                        </div>
                        <div className="meta-item">
                          <dt>克隆号</dt>
                          <dd>{displayValue(item.clone)}</dd>
                        </div>
                        <div className="meta-item">
                          <dt>厂家</dt>
                          <dd>{displayValue(item.vendor)}</dd>
                        </div>
                        <div className="meta-item">
                          <dt>浓度</dt>
                          <dd>{displayValue(item.concentration)}</dd>
                        </div>
                        <div className="meta-item">
                          <dt>厂家推荐用量</dt>
                          <dd>{displayValue(item.vendorDose)}</dd>
                        </div>
                        <div className="meta-item">
                          <dt>体系</dt>
                          <dd>{displayValue(item.system)}</dd>
                        </div>
                        <div className="meta-item">
                          <dt>染色条件</dt>
                          <dd>{displayValue(item.stainCondition)}</dd>
                        </div>
                      </dl>

                      <div className="result-image-block">
                        <p className="image-block-title">滴定结果图</p>
                        {item.imageUrl ? (
                          <>
                            <button
                              type="button"
                              className="image-trigger"
                              onClick={() => setPreview({ src: item.imageUrl!, title: previewTitle })}
                            >
                              <img src={item.imageUrl} alt={previewTitle} />
                            </button>
                            <button
                              type="button"
                              className="secondary-button"
                              onClick={() => setPreview({ src: item.imageUrl!, title: previewTitle })}
                            >
                              查看滴定结果
                            </button>
                          </>
                        ) : (
                          <div className="image-placeholder">暂无滴定结果图</div>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>

      {preview ? (
        <div className="image-modal" onClick={() => setPreview(null)}>
          <div className="image-modal-backdrop" />
          <div className="image-modal-dialog" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="image-modal-close" onClick={() => setPreview(null)}>
              ×
            </button>
            <figure className="image-modal-figure">
              <img src={preview.src} alt={preview.title} />
              <figcaption>{preview.title}</figcaption>
            </figure>
          </div>
        </div>
      ) : null}
    </>
  );
}
